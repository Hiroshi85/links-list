import {Request, Response} from 'express'


export default function notFound(req: Request, res: Response): void{
    res.status(404).render('notfound', {url: req.originalUrl})
}


