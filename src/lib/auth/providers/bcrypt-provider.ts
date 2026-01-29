import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing-provider';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptHashingProvider implements HashingProvider {
    async hash(data: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(data, salt);
    }
    compare(data: string, hashedData: string): Promise<boolean> {
        return bcrypt.compare(data, hashedData);
    }
}
