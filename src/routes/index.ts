import {Router, Request, Response} from 'express';


class Index{
    router: Router;

    constructor(){
        this.router = Router();
        this.routes();
    }

    private getIndex(req: Request, res: Response): void{
        res.render('home');
    }

    public routes(){
        this.router.get('/', this.getIndex);
    }
}

const index = new Index();
export default index.router;
