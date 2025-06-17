import User from '@/types/User';
import {RolesResponse, UserResponse} from '@/clients/UserClient';

class UserFactory {
  static createFromResponses(userResponse: UserResponse, rolesResponse: RolesResponse): User {
    return {
      id: userResponse.id,
      name: userResponse.name,
      url: userResponse.url,
      description: userResponse.description,
      link: userResponse.link,
      slug: userResponse.slug,
      avatar_urls: {
        '24': userResponse.avatar_urls['24'],
        '48': userResponse.avatar_urls['48'],
        '96': userResponse.avatar_urls['96'],
      },
      meta: userResponse.meta,
      roles: rolesResponse.roles,
    };
  }
}

export default UserFactory;
