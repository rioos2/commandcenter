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
    "icon": 'icons/logo'
  },
  "electronWinstallerConfig": {
    "name": "RioOS",
    "icon": 'icons/logo'
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
    "icon": 'public/icons/logo'
  }
};