import { registrosRouter } from './registros';
import { personasRouter } from './personas';
import { router } from "../trpc";
import { authRouter } from "./auth";
import { fotosRouter } from "./fotos";
import { usuariosRouter } from "./usuarios";

export const appRouter = router({
  fotos: fotosRouter,
  personas: personasRouter,
  usuarios: usuariosRouter,
  registros: registrosRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
