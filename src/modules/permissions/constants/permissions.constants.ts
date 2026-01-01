export const PermissionsConstants = {
  users: {
    create: 'users:create',
    read: 'users:read',
    update: 'users:update',
    delete: 'users:delete',
  },

  products: {
    create: 'products:create',
    read: 'products:read',
    update: 'products:update',
    delete: 'products:delete',
  },

  orders: {
    create: 'orders:create',
    read: 'orders:read',
    update: 'orders:update',
    delete: 'orders:delete',
  },

  roles: {
    create: 'roles:create',
    read: 'roles:read',
    update: 'roles:update',
    delete: 'roles:delete',
  },

  permissions: {
    create: 'permissions:create',
    read: 'permissions:read',
    update: 'permissions:update',
    delete: 'permissions:delete',
  },

  customers: {
    create: 'customers:create',
    read: 'customers:read',
    update: 'customers:update',
    delete: 'customers:delete',
  },

  employees: {
    create: 'employees:create',
    read: 'employees:read',
    update: 'employees:update',
    delete: 'employees:delete',
  },

  notifications: {
    create: 'notifications:create',
    read: 'notifications:read',
    update: 'notifications:update',
    delete: 'notifications:delete',
  },
} as const;