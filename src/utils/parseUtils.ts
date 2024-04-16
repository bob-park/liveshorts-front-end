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

export function parseParams(
  page: number,
  searchParams: SearchAssetParams,
): URLSearchParams {
  const metas: string[] = [];

  searchParams.broadcastDate &&
    metas.push(
      `2024-1ee5ed97-c594-4a3e-9e88-08cfbc7a2320,${searchParams.broadcastDate}`,
    );

  searchParams.channelId &&
    metas.push(
      `2024-1de7a2cd-72c6-4057-87d3-97926a85e0bb,${searchParams.channelId}`,
    );

  const params = {
    page,
    size: searchParams.size,
    isDeleted: false,
    assetStatus: 'REGISTERED',
    metas,
    title: searchParams.title || '',
    existShortForm:
      searchParams.isShortForm == undefined ? '' : searchParams.isShortForm,
    onlyCreateShortFormByMe: searchParams.onlyCreateShortFormByMe,
  };

  const urlSearchParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value instanceof Array) {
      value.forEach((item) => {
        urlSearchParams.append(key, item);
      });
    } else {
      urlSearchParams.set(key, value != undefined ? value + '' : '');
    }
  });

  return urlSearchParams;
}
