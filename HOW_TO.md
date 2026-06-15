### How to use [Authz from Resolute tool](https://resolute.vitwit.com/)

**Step-1:**
- Go to [Authz page on Resolute](https://resolute.vitwit.com/authz)  and click on **Granted to me** tab
- It will list down all the accounts you have access via authz. Click on **Use** for the respective account you wish to use the delegates permission
- Now the entire app works in authz mode. It means, whatever the action you perform after switching will be done on behalf of original granter account.
![Screenshot from 2023-05-24 20-09-38](https://github.com/vitwit/resolute/assets/3479820/d173df35-97a4-4b75-8de0-096ed4ef65f3)


**Step-2**:
- Go to governance tab to vote on the proposals.
![Screenshot from 2023-05-24 20-09-46](https://github.com/vitwit/resolute/assets/3479820/0c371e2c-2fef-4ff9-ad90-2811a2ca581d)

 - Just click on vote and cast your vote on behalf of the validator account.

**Pre-requisite**
- In order to use **authz** mode on resolute, the validator account should give vote authz permission via CLI tool or on Resolute. To give authz permission via Resolute:
**Step-1: Give authz permission to a delegates account**
- Go to [authz page](https://resolute.vitwit.com/authz) and click on **Grant New**
- Select **Generic** and choose message type as *Vote* and enter the **delegates** address.
- You can select the expiry for the **Vote** authorization
- Click **Grant** and approve the transaction on Keplr.
![Screenshot from 2023-05-19 18-51-18](https://github.com/vitwit/resolute/assets/3479820/916b9409-2bc7-48e9-b686-6682fd7dbdde)


That's it, now the **delegates** account can vote on behalf of your validator
