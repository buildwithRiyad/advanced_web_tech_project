import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  private users: any[] = [];

  create(dto: CreateUserDto) {
    const user = { id: Date.now().toString(), ...dto };
    this.users.push(user);
    return { data: user };
  }

  findAll(role?: string) {
    if (role) {
      return { data: this.users.filter(u => u.role === role) };
    }
    return { data: this.users };
  }

  findOne(id: string) {
    return { data: this.users.find(u => u.id === id) };
  }

  update(id: string, dto: UpdateUserDto) {
    const user = this.users.find(u => u.id === id);
    Object.assign(user, dto);
    return { data: user };
  }

  assignRole(id: string, dto: AssignRoleDto) {
    const user = this.users.find(u => u.id === id);
    user.role = dto.role;
    return { data: user };
  }

  remove(id: string) {
    this.users = this.users.filter(u => u.id !== id);
    return { message: 'deleted' };
  }

  logs() {
    return { data: [] };
  }

  backup() {
    return { data: JSON.stringify(this.users) };
  }
}