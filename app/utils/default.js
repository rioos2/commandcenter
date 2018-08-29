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
    defaultSecret:      'rsa',
    secretTypes:        'rsa,ecdsa,ed25519',
    bitsInKey:          '2048',
    trusted_key:        'rioos_sh/kryptonite'
  },
};

export default D;
