import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PosteventService } from './postevent.service';
import { CreatePosteventDto } from './dto/create-postevent.dto';
import { UpdatePosteventDto } from './dto/update-postevent.dto';

@Controller('postevent')
export class PosteventController {
  constructor(private readonly posteventService: PosteventService) {}

  @Post()
  create(@Body() createPosteventDto: CreatePosteventDto) {
    return this.posteventService.create(createPosteventDto);
  }

  @Get()
  findAll() {
    return this.posteventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posteventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePosteventDto: UpdatePosteventDto) {
    return this.posteventService.update(+id, updatePosteventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posteventService.remove(+id);
  }
}
