# Steps to run the playbook

1. Clone the github repository and go into the ansible folder.
2. Run the command ```cp example_inventory.ini inventory.ini```
3. In the ```inventory.ini``` file make all the required changes to the following fields

```
ansible_ssh_private_key_file= "Specify the full path to the ssh private key Example:~/.ssh/id_rsa"
ssh_file_path="Specify the full path to id_rsa.pub Example: .ssh/id_rsa.pub"
digital_ocean_api_token="Specify the digital ocean token"
ssh_key_name="Specify the name assigned to your ssh key on digital ocean"
user="Specify the type of user you want Example: root"

```

3. Run the playbook using the command :
```ansible-playbook main.yml  -i inventory.ini```
4. Enter the server ip:3000 to open the resolute frontend