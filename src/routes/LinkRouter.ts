import {Router, Request, Response} from 'express'
//Conexión a la base de datos
import pool from '../database'
import Auth from '../lib/auth';

class LinkRouter {
    router: Router;
    auth: Auth;

    constructor(auth: Auth) {
        this.router = Router();
        this.auth = auth
        this.routes();
    }

    private getAdd(req: Request, res: Response): void{
        res.render('links/add')
    }

    private async postAdd(req: Request, res: Response): Promise<void>{
        console.log(req.body)
        const newLink = {
            ...req.body,
            //@ts-ignore
            user_id: req.user.id
        };
        //@ts-ignore
        console.log(req.user.id)
        await pool.query('INSERT INTO links SET ?', [newLink])
        req.flash('success', 'Link saved successfully')
        res.redirect('/links');
    }
    
    private async getLinks(req: Request, res: Response): Promise<void>{
        //@ts-ignore
        console.log(req.user.id)
        //@ts-ignore
        const [rows] = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
        res.render('links/list', {links: rows});
    }

    private async getDelete(req: Request, res:Response): Promise<void>{
        //@ts-ignore
        console.log(req.user.id)
        const {id} = req.params
        //@ts-ignore
        const [rows] = await pool.query('DELETE FROM links WHERE ID=? AND user_id=?', [id, req.user.id])
        console.log(rows)
        //@ts-ignore
        if(rows.affectedRows !== 0)
            req.flash('success', 'Link removed successfully')
        else
            req.flash('failure', 'Link doesn\'t exist')
    
        res.redirect('/links');
    }

    private async getEdit(req: Request, res: Response): Promise<void>{
        const {id} = req.params
        //@ts-ignore
        const [rows] = await pool.query('SELECT * FROM links WHERE id=? AND user_id=?', [id, req.user.id])
        console.log(rows)
        //@ts-ignore
        if (rows.length !== 0)
            //@ts-ignore
            res.render('links/edit', {link: rows[0]})
        else{
            req.flash('failure', 'Link doesn\'t exist')
            res.redirect('/links')
        }
    }

    private async postEdit(req:Request, res: Response): Promise<void>{
        const {id} = req.params;
        const newLink = {...req.body}
        console.log(newLink)
        await pool.query('UPDATE links SET ? WHERE id=?', [newLink, id]);
        req.flash('success', 'Link updated successfully')
        res.redirect("/links")
    }

    public routes(){
        this.router.use(auth.isLoggedIn);

        this.router.get('/add', this.getAdd);
        this.router.post('/add', this.postAdd);
        this.router.get('/', this.getLinks);
        this.router.get('/delete/:id', this.getDelete)
        this.router.get('/edit/:id', this.getEdit);
        this.router.post('/edit/:id', this.postEdit);
    }
}

const auth = new Auth();
const linkRouter = new LinkRouter(auth);

export default linkRouter.router;