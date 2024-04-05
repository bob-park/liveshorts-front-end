type RoleType = {
  id: string;
  name: string;
};

const UserRole = {
  id: 'ROLE_USER',
  name: '일반 사용자',
};

const ManagerRole = {
  id: 'ROLE_MANAGER',
  name: '관리자',
};

const SuperManagerRole = {
  id: 'ROLE_ADMIN',
  name: '슈퍼 관리자',
};

const roles = [UserRole, ManagerRole, SuperManagerRole];

export function getRoleType(roleType: string): RoleType {
  return roles.find((item) => item.id === roleType) || UserRole;
}
