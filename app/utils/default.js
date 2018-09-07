var D = {
  VPS: {
    computeType:        'cpu',
    domain:             '.rioosbox.com',
    region:             'chennai',
    cpuCore:            1,
    ram:                1,
    storage:            10,
    storageType:        'ssd',
    network:            'public_ipv4',
    destro:             '',
    destroVersion:      '',
    disableSecretTypes: '',
    defaultSecret:      'rioos_sh_ssh_rsa',
    secretTypes:        'rioos_sh_ssh_rsa,rioos_sh_ssh_dsa,rioos_sh_ssh_ed25519,rioos_sh_ssh_x509',
    bitsInKey:          '2048',
  },
};

export default D;
