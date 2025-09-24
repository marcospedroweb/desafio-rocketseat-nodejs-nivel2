import 'fastify';
import type { User } from './models/user.model.js';

declare module 'fastify' {
  interface FastifyRequest {
    userId?: User;
  }
}
