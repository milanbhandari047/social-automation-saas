"use strict";
// /*
//   NOTE:
//   Prisma Client types are generated from the Prisma schema.
//   During local/dev setup (or in CI without DATABASE_URL), generation may not exist yet.
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
//   To avoid TS build failures for unrelated code, we import PrismaClient type/value
//   via a dynamic require and fall back to `any`.
// */
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const PrismaClientCtor: any = (() => {
//   try {
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     return require("@prisma/client").PrismaClient;
//   } catch {
//     return undefined;
//   }
// })();
// const globalForPrisma = globalThis as unknown as {
//   prisma: any | undefined;
// };
// export const prisma =
//   globalForPrisma.prisma ??
//   (PrismaClientCtor ? new PrismaClientCtor() : ({} as any));
// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ?? new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
