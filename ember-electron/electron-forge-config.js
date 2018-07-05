module.exports = {
  "make_targets": {
    "win32": [
      "squirrel"
    ],
    "darwin": [
      "zip"
    ],
    "linux": [
      "deb",
     // "rpm"
    ]
  },
  "electronPackagerConfig": {
    "packageManager": "yarn",
    "icon": 'assets/img/logo.ico'
  },
  "electronWinstallerConfig": {
    "name": "RioOS",
    "icon": 'assets/img/logo.ico',
    "setupIcon": "assets/img/logo.ico"
  },
  "electronInstallerDebian": {},
  "electronInstallerRedhat": {},
  "github_repository": {
    "owner": "",
    "name": ""
  },
  "windowsStoreConfig": {
    "packageName": "",
    "name": "RioOS",
    "icon": 'assets/img/logo.ico'
  }
};