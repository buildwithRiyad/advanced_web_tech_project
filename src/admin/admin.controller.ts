import { Controller, Post, Get, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from './dto/admin.dto';

@Controller('admin') // Base Route: /admin
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Create new user
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.adminService.create(dto);
  }

  //Get all users (optional role filter)
  @Get()
  findAll(@Query('role') role: string) {
    return this.adminService.findAll(role);
  }

  // Get single user by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  //  Update full user data
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.adminService.update(id, dto);
  }

  //Update only user role
  @Patch(':id/role')
  assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto) {
    return this.adminService.assignRole(id, dto);
  }

  // Delete user
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  //  Get system logs
  @Get('logs/all')
  logs() {
    return this.adminService.logs();
  }

  //system backup
  @Post('backup')
  backup() {
    return this.adminService.backup();
  }
}