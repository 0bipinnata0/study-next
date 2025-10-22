import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, inArray, isNotNull, isNull, lt, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const commentsRouter = createTRPCRouter({
    // remove: protectedProcedure
    //     .input(z.object({
    //         id: z.uuid(),
    //     }))
    //     .mutation(async ({ input, ctx }) => {
    //         const { id } = input;
    //         const { id: userId } = ctx.user;

    //         const [deletedComment] = await db
    //             .delete(comments)
    //             .where(and(
    //                 eq(comments.id, id),
    //                 eq(comments.userId, userId),
    //             ))
    //             .returning();

    //         if (!deletedComment) {
    //             throw new TRPCError({ code: "NOT_FOUND" });
    //         }

    //         return deletedComment;
    //     }),
    create: protectedProcedure
        .input(z.object({
            parentId: z.uuid().nullish(),
            videoId: z.uuid(),
            value: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { parentId, videoId, value } = input;
            const { id: userId } = ctx.user;

            const [existingComment] = await db
                .select()
                .from(comments)
                .where(inArray(comments.id, parentId ? [parentId] : []));

            if (!existingComment && parentId) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            if (existingComment?.parentId && parentId) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }

            const [createdComment] = await db
                .insert(comments)
                .values({ userId, videoId, parentId, value })
                .returning();

            return createdComment;
        }),
    getMany: baseProcedure
        .input(
            z.object({
                videoId: z.uuid(),
                parentId: z.uuid().nullish(),
                cursor: z.object({
                    id: z.uuid(),
                    updatedAt: z.date(),
                }).nullish(),
                limit: z.number().min(1).max(100),
            }),
        )
        .query(async ({ input }) => {
            // const { clerkUserId } = ctx;
            const { videoId } = input;

            const data = await db.select({
                user: users,
                ...getTableColumns(comments)
            }).from(comments).where(eq(comments.videoId, videoId))
                .innerJoin(users, eq(comments.userId, users.id))
            return data
        }),
});
