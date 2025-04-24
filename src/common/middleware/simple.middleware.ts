export class { NestMiddleware } from '@nestjs/common'

export class SimpleMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        throw new Error('Method not implemeted.')

        return res.status(404).send({
            mensage: 'test'
        })
    }
}