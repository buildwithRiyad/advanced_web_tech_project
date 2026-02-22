export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'receptionist';
}

export class UpdateUserDto {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: 'manager' | 'receptionist';
}

export class AssignRoleDto {
  id: string;
  role: 'manager' | 'receptionist';
}