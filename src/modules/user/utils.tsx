import { Rules } from '../../config/rbac-rules';

/**
 * Checks if a given role can perform a specific action
 * 
 * @param {Rules} rules - The rules to check the permissions
 * @param {string} role - The role about to be checked
 * @param {string} action - The action to perform
 * @param {object} data - The data needed to check the rights
 * 
 * @returns {boolean} 
 */
export function check (rules: Rules, role: string, action: string, data: any): boolean {
  const permissions = rules[role];

  if (!permissions) {
    // role is not present in the rules
    return false;
  }

  const staticPermissions = permissions.static;

  if (staticPermissions && staticPermissions.includes(action)) {
    // User is granted to perform the action
    return true;
  }

  const dynamicPermissions = permissions.dynamic;

  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action];
    if (!permissionCondition) {
      // dynamic rule not provided for action
      return false;
    }

    return permissionCondition(data);
  }

  return false;
}
