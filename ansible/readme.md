# Steps to run the playbook

1. Clone the github repository and go into the ansible folder.
2. Run the command ```cp example_inventory.ini inventory.ini```
3. In the ```inventory.ini``` file make all the required changes to the following fields

```
ansible_ssh_private_key_file= "~/.ssh/id_rsa"
ssh_file_path="Specify the path to the pub key"
digital_token="Specify the digital ocean token"
ssh_key_name="Specify the name assigned to your ssh key on digital ocean"

```

3. Run the playbook using the command :
```ansible-playbook main.yml  -i inventory.ini```