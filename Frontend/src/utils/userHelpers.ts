import { UserDto } from '../services/api';

/**
 * Format user's full name from UserDto
 */
export const formatUserName = (
  user: UserDto | { first_name: string; last_name: string },
): string => {
  return `${user.first_name} ${user.last_name}`;
};

/**
 * Get user name by ID from a list of users
 */
export const getUserNameById = (
  userId: string | null | undefined,
  users: UserDto[],
  fallback = 'Unknown',
): string => {
  if (!userId) return 'Unassigned';
  const user = users.find((u) => u.id === userId);
  return user ? formatUserName(user) : fallback;
};
