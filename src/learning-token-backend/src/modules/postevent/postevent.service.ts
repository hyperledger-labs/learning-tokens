import { Injectable } from '@nestjs/common';
import { CreatePosteventDto } from './dto/create-postevent.dto';
import { UpdatePosteventDto } from './dto/update-postevent.dto';

@Injectable()
export class PosteventService {
  create(createPosteventDto: CreatePosteventDto) {
    return 'This action adds a new postevent';
  }

  findAll() {
    return `This action returns all postevent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postevent`;
  }

  update(id: number, updatePosteventDto: UpdatePosteventDto) {
    return `This action updates a #${id} postevent`;
  }

  remove(id: number) {
    return `This action removes a #${id} postevent`;
  }
}
