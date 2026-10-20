# Cinema Ticket System

Projekt uruchamia system biletów kinowych na trzech maszynach wirtualnych:

| VM | Adres prywatny | Rola |
|---|---|---|
| `db` | `192.168.56.10` | PostgreSQL |
| `backend` | `192.168.56.11` | Spring Boot |
| `frontend` | `192.168.56.12` | Angular + Nginx |

Komunikacja między maszynami odbywa się przez prywatną sieć VirtualBox.
Frontend jest dodatkowo dostępny z komputera hosta pod adresem
`http://localhost:8080` (port hosta `8080` jest przekierowany na port `80`
maszyny `frontend`).

## Wymagania

### Wszystkie systemy

Przed uruchomieniem projektu zainstaluj:

- Git,
- VirtualBox 7.2.x,
- Vagrant 2.4.9 lub nowszy,
- Packer 1.10 lub nowszy (plugin `vagrant` instaluje `packer init`),
- Java JDK 21,
- Node.js 22 oraz npm,
- GNU Make,
- Ansible,
- kolekcje Ansible z pliku `ansible/collections/requirements.yml`.

Konfiguracja używa providera VirtualBox. Maszyny powstają z własnego boxa
`cinema/ubuntu-24.04-base`, który Packer buduje na bazie
`bento/ubuntu-24.04` w wersji `202510.26.0` (szczegóły w sekcji
[Obraz bazowy a Ansible](#obraz-bazowy-packer-a-konfiguracja-ansible)).
Vagrant dobiera architekturę boxa automatycznie, więc konfiguracja działa na
komputerach Intel i Apple Silicon, o ile używane wersje VirtualBox i Vagranta
obsługują daną architekturę. Obraz trzeba zbudować na komputerze o tej samej
architekturze, na którym będą uruchamiane maszyny.

### macOS i Linux

Ansible działa bezpośrednio na systemie hosta. Po zainstalowaniu wymaganych
pakietów upewnij się, że polecenia `vagrant`, `VBoxManage`, `java`, `node`,
`npm`, `make` i `ansible-playbook` i `packer` są dostępne w `PATH`.

Na macOS system może poprosić o zgodę na dostęp Vagranta, VirtualBoxa,
terminala lub przeglądarki do sieci lokalnej. Należy ją przyznać w
`Ustawienia systemowe → Prywatność i bezpieczeństwo → Sieć lokalna`.

### Windows

Ansible nie działa natywnie jako control node w Windows. Najprostsza
konfiguracja to:

1. zainstalować w Windows VirtualBox i Vagranta,
2. włączyć WSL2 oraz zainstalować dystrybucję Ubuntu,
3. w WSL2 zainstalować Git, JDK 21, Node.js/npm, GNU Make i Ansible,
4. uruchamiać polecenia projektowe z powłoki WSL2.

W WSL2 ustaw dostęp Vagranta do instalacji Windows:

```bash
export VAGRANT_WSL_ENABLE_WINDOWS_ACCESS=1
export PATH="$PATH:/mnt/c/Program Files/Oracle/VirtualBox"
```

Repozytorium najlepiej przechowywać w systemie plików Windows, np.
`/mnt/c/Users/<użytkownik>/projekty/devops-projekt-1`. Wsparcie Vagranta
dla WSL2 zależy od wersji narzędzi, dlatego w razie problemów z integracją
można uruchomić Vagranta z PowerShella, a Ansible z WSL2.

Packera również należy uruchamiać z WSL2 (`make box`). Vagrant w WSL2 trzyma boxy w
`~/.vagrant.d` po stronie Linuksa, więc box dodany Vagrantem z PowerShella
nie byłby widoczny dla `vagrant up` z WSL2 (chyba że w obu miejscach
ustawiono to samo `VAGRANT_HOME`).

Dwa ustawienia WSL2, bez których Vagrant + Ansible z WSL2 zwykle nie
działają:

- `%UserProfile%\.wslconfig` (Windows 11 22H2+) - wspólna sieć z Windows,
  żeby z WSL2 działało `127.0.0.1:2222` (SSH Vagranta/Packera):

  ```ini
  [wsl2]
  networkingMode=mirrored
  ```

- `/etc/wsl.conf` w Ubuntu - uprawnienia plików na `/mnt/c`, inaczej SSH
  odrzuca klucze z `.vagrant/machines/*/virtualbox/private_key`
  („UNPROTECTED PRIVATE KEY FILE”):

  ```ini
  [automount]
  options = "metadata,umask=22,fmask=11"
  ```

Po zmianie obu plików wykonać w PowerShellu `wsl --shutdown`.

VirtualBox działający obok Hyper-V (wymaganego przez WSL2) bywa wolny, a
maszyny z kilkoma procesorami potrafią się zacinać przy starcie. Pomaga
ograniczenie każdej maszyny do jednego procesora:

```bash
export CINEMA_VM_CPUS=1
vagrant up
```


## Budowanie projektu i uruchamianie VM

Poniższa procedura jest przeznaczona dla świeżego klona repozytorium.

### 1. Pobranie repozytorium

```bash
git clone <URL_REPOZYTORIUM>
cd devops-projekt-1
```

### 2. Instalacja kolekcji Ansible

```bash
ansible-galaxy collection install \
  -r ansible/collections/requirements.yml
```

### 3. Przygotowanie Ansible Vault

Provisioning pyta o hasło do Ansible Vault. Plik
`ansible/group_vars/all/vault.yml` musi zawierać zaszyfrowaną zmienną
`postgres_db_password`, np.:

```yaml
postgres_db_password: "haslo-bazy"
```

Jeśli plik nie istnieje, utwórz go poleceniem:

```bash
ansible-vault create ansible/group_vars/all/vault.yml
```

Nie zapisuj hasła Vault w repozytorium. Przy każdym `vagrant up` lub
`vagrant provision` Vagrant poprosi o to hasło.

### 4. Zbudowanie obrazu bazowego (Packer)

```bash
make box
```

Polecenie:

1. pobiera box `bento/ubuntu-24.04` (`202510.26.0`), jeśli nie ma go jeszcze
   w Vagrancie,
2. instaluje plugin Packera (`packer init`) i sprawdza szablon
   (`packer validate`),
3. uruchamia tymczasową maszynę z boxa bento, instaluje w niej wspólne
   zależności i zabezpieczenia, a następnie pakuje ją do
   `packer/output/package.box` (`packer build`),
4. dodaje gotowy obraz do Vagranta jako `cinema/ubuntu-24.04-base`.

Bez `make` te same kroki to:

```bash
vagrant box add bento/ubuntu-24.04 --box-version 202510.26.0 --provider virtualbox
packer init packer
packer build -force packer
vagrant box add --force --name cinema/ubuntu-24.04-base packer/output/package.box
```

Pierwsze polecenie zgłosi błąd, jeśli box bento już jest - można go wtedy
pominąć. Obraz wystarczy zbudować raz; ponownie tylko po zmianach w katalogu
`packer/`. Maszyny utworzone ze starej wersji obrazu trzeba odtworzyć
(`vagrant destroy -f && vagrant up`).

### 5. Zbudowanie artefaktów

```bash
make build
```

Polecenie buduje:

- backendowy artefakt
  `target/cinema-tickets-system-0.0.1-SNAPSHOT.jar`,
- produkcyjny frontend Angulara w
  `frontend/cinema-ticket-system-front/dist/cinema-ticket-system-front/browser/`.

Dostępne są również osobne cele:

```bash
make backend   # tylko backend
make frontend  # tylko frontend
make test      # testy backendu i frontendu
make clean     # usuwa artefakty budowania
```

### 6. Uruchomienie i provisioning VM

Po zbudowaniu artefaktów uruchom wszystkie maszyny:

```bash
vagrant up --provider=virtualbox
```

Podczas pierwszego uruchomienia Vagrant utworzy maszyny z obrazu
`cinema/ubuntu-24.04-base` i wykona provisioning Ansible. Playbook na
początku sprawdza, czy maszyna powstała z tego obrazu, i przerywa działanie
z czytelnym komunikatem, jeśli nie. Możesz sprawdzić stan maszyn:

```bash
vagrant status
```

Jeśli maszyny już działają, a zmieniono playbooki, role lub artefakty,
wykonaj provisioning ponownie:

```bash
vagrant provision
```

Tylko jedną maszynę można skonfigurować poleceniem:

```bash
vagrant provision frontend
```

### 7. Weryfikacja działania

Frontend:

```bash
curl http://localhost:8080
```

Można też wejść w przeglądarce na `http://localhost:8080`. Bez
przekierowania portu frontend jest dostępny bezpośrednio w prywatnej sieci
pod adresem `http://192.168.56.12`.

Przykładowa weryfikacja backendu z poziomu maszyny `backend`:

```bash
vagrant ssh backend -c "curl http://localhost:8080/movies"
```

Stan usług można sprawdzić na VM, np.:

```bash
vagrant ssh frontend -c "systemctl status nginx --no-pager"
vagrant ssh backend -c "systemctl status cinema-backend --no-pager"
```

#### Test zabezpieczeń

```bash
make verify
```

Playbook `ansible/tests/verify.yml`  sprawdza:

- na każdej maszynie: efektywną konfigurację `sshd` (`sshd -T`) pod kątem
  `PermitRootLogin no` oraz to, że UFW jest aktywny z domyślną polityką
  `deny (incoming)`,
- na maszynie `db`: czy PostgreSQL nasłuchuje tylko na adresie prywatnym,
- między maszynami: czy dozwolone połączenia przechodzą
  (frontend → backend:8080, backend → db:5432), a zabronione są blokowane
  (frontend → db:5432, db → backend:8080),
- z hosta: czy aplikacja odpowiada przez `localhost:8080` (również `/api`),
  a backend i baza nie są dostępne bezpośrednio.

Każdy test „port zablokowany” ma parę „port 22 otwarty” między tymi samymi
maszynami. Dzięki temu wynik „zablokowany” oznacza, że ruch odrzucił
firewall, a nie że maszyny w ogóle się nie widzą.

### 8. Zatrzymanie i usunięcie środowiska

Zatrzymanie maszyn bez usuwania danych:

```bash
vagrant halt
```

Usunięcie maszyn wirtualnych:

```bash
vagrant destroy
```

Usunięcie VM nie usuwa kodu projektu ani pobranego boxa.

## Obraz bazowy (Packer) a konfiguracja (Ansible)

Wszystkie trzy maszyny powstają z jednego obrazu `cinema/ubuntu-24.04-base`
(szablon `packer/ubuntu-base.pkr.hcl`, skrypty w `packer/scripts/`).
Do obrazu trafia to, co jest wspólne dla każdej maszyny i rzadko się
zmienia. Wszystko, co zależy od roli maszyny, adresów w sieci lub
sekretów, konfiguruje Ansible.

| Element | Gdzie | Dlaczego |
|---|---|---|
| `python3`, `python3-apt` | Packer | Bez nich Ansible nie zadziała (moduły, w tym `apt`); potrzebne na każdej maszynie, zanim Ansible w ogóle ruszy. |
| `acl`, `ca-certificates` | Packer | Wspólne zależności (`acl` dla `become_user: postgres`). Wcześniej instalowała je rola `common`, która została usunięta. |
| Strefa czasowa `Europe/Warsaw` | Packer | Taka sama wszędzie, nie zależy od roli. |
| Wyłączone `apt-daily` / automatyczne aktualizacje | Packer | Aktualizacje w tle zajmują blokadę `dpkg` zaraz po starcie i psują zadania `apt` w Ansible. Aktualizujemy świadomie: nowa wersja boxa bento + przebudowa obrazu. |
| UFW zainstalowany i włączony (deny incoming, allow SSH) | Packer + Ansible | Maszyna jest chroniona od pierwszego uruchomienia. Ansible (rola `security`) wymusza te same ustawienia przy każdym provisioningu. |
| `PermitRootLogin no`, zablokowane hasło roota | Packer + Ansible | Jak wyżej: bezpieczna wartość domyślna w obrazie, Ansible pilnuje jej na działających maszynach. |
| Reguły firewalla dla usług (5432, 8080, 80) | Ansible | Zależą od roli maszyny i adresów pozostałych maszyn. |
| PostgreSQL, Java 21, Nginx | Ansible | Każdy pakiet jest potrzebny tylko na jednej maszynie. Wbudowanie ich w obraz oznaczałoby jeden ciężki obraz z niepotrzebnymi usługami albo trzy osobne obrazy. |
| Konfiguracja usług, artefakty aplikacji (JAR, build Angulara) | Ansible | Zmieniają się przy każdym wdrożeniu; przebudowa obrazu trwa dużo dłużej niż `vagrant provision`. |
| Hasło do bazy | Ansible Vault | Sekrety nie mogą trafić do obrazu, który jest zwykłym plikiem `.box`. |

Przed spakowaniem obraz jest czyszczony: usuwany jest cache `apt`, logi,
pliki tymczasowe i `machine-id`, więc każda maszyna dostaje przy pierwszym
starcie własny identyfikator. W obrazie zostaje plik `/etc/cinema-base-image`
z nazwą obrazu, wersją boxa bazowego i datą budowania. Playbook `site.yml`
sprawdza go na początku.

## Zabezpieczenia

- **Firewall (UFW)** na każdej maszynie: domyślnie blokuje ruch przychodzący,
  przepuszcza SSH oraz:
  - `db`: port 5432 tylko z `backend` (192.168.56.11); PostgreSQL nasłuchuje
    tylko na adresie prywatnym, a `pg_hba.conf` wpuszcza tylko użytkownika
    `cinema` z adresu backendu,
  - `backend`: port 8080 tylko z `frontend` (192.168.56.12),
  - `frontend`: port 80 z sieci prywatnej i z NAT VirtualBoxa (przekierowanie
    `localhost:8080`).
- **Blokada logowania na roota przez SSH**: `PermitRootLogin no` (plik
  `/etc/ssh/sshd_config.d/10-cinema-hardening.conf` oraz `sshd_config`),
  hasło roota zablokowane.
- Backend działa jako osobny użytkownik systemowy `cinema` bez powłoki,
  a plik z danymi dostępowymi do bazy ma uprawnienia `0600`.

Wszystko to sprawdza `make verify`.
