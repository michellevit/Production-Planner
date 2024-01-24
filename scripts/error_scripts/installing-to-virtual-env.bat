@echo off


:: For first time app deployment (create venv in project's root directory)
:: cd "%~dp0\.."
:: cd ".."
:: python -m venv venv


:: Activate Virtual Environment
:: cd "%~dp0\.."
:: cd  "..\venv\Scripts"
:: activate.bat
:: "%~dp0"


:: For first time app deployment
:: cd "%~dp0\.."
:: cd ".."
:: pip install -r requirements.txt


:: For single module installation
:: pip install *module_name_here*


:: to keep requirements.txt up to date: 
:: cd "%~dp0\.."
:: cd ".."
:: pip freeze > requirements.txt



pause

exit /b 0