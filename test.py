from fastapi import FastAPI, HTTPException
from module import Account

app = FastAPI()
accountlist : dict[int, Account] = {}

@app.get("/")
def root():
    return {"message": "Hello World"}

#add account 
@app.post("/accounts/")
def add_account (account_name: str, account_password: str):
    
    # Check if account name and password are provided
    if not account_name or not account_password:
        raise HTTPException(status_code=400, detail="Account name and password are required")
    
    # Check if account name and password are unique
    for account in accountlist.values():
        if account_name == account.account_name or account_password == account.account_password:
            raise HTTPException(status_code=400, detail="Accounts or passwords already exist")
     
    # Create a new account
    accountid = len(accountlist)+1
    accountlist[accountid] = Account(account_name=account_name, account_password=account_password)
    return{"accounts": accountlist[accountid]}

@app.get("/accounts/{account_name}")
def get_account(account_name: str):

    for account in accountlist.values():
    # DO if account name matches
        if account_name == account.account_name:
            return {"accounts": account}
        
    # Do if account password matches
    raise HTTPException(status_code=404, detail="Account not found")

@app.delete("/accounts/{account_name}")
def delete_account(account_name: str):

    # Check if account already exists to delete
    for accountid, account in accountlist.items():
        if account_name == account.account_name:
            del accountlist[accountid]
            return {"message": "Account deleted successfully"}
    
    # Do if nothing matches
    raise HTTPException(status_code=404, detail="Account not found")