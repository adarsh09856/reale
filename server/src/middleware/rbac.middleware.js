export const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required before checking permissions.'
      });
    }

    // Super Admin has unrestricted access to everything
    if (req.user.roleName === 'super_admin') {
      return next();
    }

    const hasPermission = Array.isArray(requiredPermission)
      ? requiredPermission.some(p => req.user.permissions.includes(p))
      : req.user.permissions.includes(requiredPermission);

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: You do not have the required '${Array.isArray(requiredPermission) ? requiredPermission.join(' or ') : requiredPermission}' permission.`
      });
    }

    next();
  };
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    const rolesList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!rolesList.includes(req.user.roleName) && req.user.roleName !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: `Forbidden: This action requires role ${rolesList.join(', ')}.`
      });
    }

    next();
  };
};
