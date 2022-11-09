import { Router } from "express";
const router = Router();
import { productosRandom } from '../utils/faker.js';
import { logout, signin, signup, auth } from '../controllers/userController.js'


router.get('/login', (req, res) => res.render('login'))
router.post('/login', signin);
router.get('/logout', logout);
router.get('/registro', (req, res) => res.render('register'))
router.post('/registro', signup)

router.get('/error-login', (req, res) => res.render('faillogin'))
router.get('/error-registro', (req, res) => res.render('failregister'))

router.get('/productos-test', auth ,async (req, res) => {
    try {
        const productosFaker = productosRandom();
        res.json(productosFaker);
    } catch (err) {
        res.status(500).send(`No se puede recuperar los datos ${err}`);
    }
});

export default router;