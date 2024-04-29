import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '@nestjs/common/exceptions';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
    constructor() {}

    use(req: Request, res: Response, next: NextFunction) {
        const apiKey = req.headers['apikey'];
        const apiKeySystem: string = process.env.API_KEY;
        if (!apiKey || apiKey !== apiKeySystem) {
            throw new ForbiddenException('Forbidden');
        }
        next();
    }
}
