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
- Java JDK 21,
- Node.js 22 oraz npm,
- GNU Make,
- Ansible,
- kolekcje Ansible z pliku `ansible/collections/requirements.yml`.

Konfiguracja używa providera VirtualBox oraz boxa
`bento/ubuntu-24.04` w wersji `202510.26.0`. Vagrant dobiera architekturę
boxa automatycznie, więc konfiguracja
działa na komputerach Intel i Apple Silicon, o ile używane wersje VirtualBox
i Vagranta obsługują daną architekturę.

### macOS i Linux

Ansible działa bezpośrednio na systemie hosta. Po zainstalowaniu wymaganych
pakietów upewnij się, że polecenia `vagrant`, `VBoxManage`, `java`, `node`,
`npm`, `make` i `ansible-playbook` są dostępne w `PATH`.

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

### 4. Zbudowanie artefaktów

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

### 5. Uruchomienie i provisioning VM

Po zbudowaniu artefaktów uruchom wszystkie maszyny:

```bash
vagrant up --provider=virtualbox
```

Podczas pierwszego uruchomienia Vagrant pobierze box i wykona provisioning
Ansible. Możesz sprawdzić stan maszyn:

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

### 6. Weryfikacja działania

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

### 7. Zatrzymanie i usunięcie środowiska

Zatrzymanie maszyn bez usuwania danych:

```bash
vagrant halt
```

Usunięcie maszyn wirtualnych:

```bash
vagrant destroy
```

Usunięcie VM nie usuwa kodu projektu ani pobranego boxa.
