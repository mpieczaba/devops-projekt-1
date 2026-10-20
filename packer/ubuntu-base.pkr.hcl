// Base model for each of our machines - bento/ubuntu-24.04
//
// Included Ansible dependencies, UFW, base SSH hardening, timezones.
//
// To build:
//   packer init packer
//   packer build -force packer
//   vagrant box add --force --name cinema/ubuntu-24.04-base packer/output/package.box
// or simply: make box

packer {
  required_version = ">= 1.10.0"

  required_plugins {
    vagrant = {
      source  = "github.com/hashicorp/vagrant"
      version = ">= 1.1.0"
    }
  }
}

variable "source_box" {
  type        = string
  description = "Box z Vagrant Cloud, na którym bazuje obraz."
  default     = "bento/ubuntu-24.04"
}

variable "source_box_version" {
  type        = string
  description = "Wersja boxa bazowego (używana, gdy Packer sam dodaje box)."
  default     = "202510.26.0"
}

variable "skip_add" {
  type        = bool
  description = <<-EOT
    true  - box bazowy musi już być w Vagrancie (make box dodaje go wcześniej),
    false - Packer wykona `vagrant box add` (kończy się błędem, jeśli box już jest).
  EOT
  default     = true
}

variable "image_name" {
  type        = string
  description = "Nazwa, pod którą gotowy box zostanie dodany do Vagranta."
  default     = "cinema/ubuntu-24.04-base"
}

variable "timezone" {
  type    = string
  default = "Europe/Warsaw"
}

source "vagrant" "ubuntu_base" {
  source_path  = var.source_box
  box_version  = var.source_box_version
  provider     = "virtualbox"
  skip_add     = var.skip_add
  communicator = "ssh"

  // Zostawiamy publiczny klucz "insecure" Vagranta w obrazie - przy pierwszym
  // `vagrant up` Vagrant podmienia go na klucz wygenerowany per maszyna.
  insert_key = false

  output_dir      = "${path.root}/output"
  teardown_method = "destroy"
}

build {
  name    = "cinema-base"
  sources = ["source.vagrant.ubuntu_base"]

  provisioner "shell" {
    execute_command = "echo 'vagrant' | {{ .Vars }} sudo -S -E bash '{{ .Path }}'"

    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "IMAGE_NAME=${var.image_name}",
      "SOURCE_BOX=${var.source_box}",
      "SOURCE_BOX_VERSION=${var.source_box_version}",
      "TIMEZONE=${var.timezone}",
    ]

    scripts = [
      "${path.root}/scripts/01-packages.sh",
      "${path.root}/scripts/02-hardening.sh",
      "${path.root}/scripts/99-cleanup.sh",
    ]
  }
}
