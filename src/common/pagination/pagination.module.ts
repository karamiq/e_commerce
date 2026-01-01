import { PaginationService } from './pagination.service';
/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [
        PaginationService,],
    exports: [PaginationService],
})
export class PaginationModule { }
