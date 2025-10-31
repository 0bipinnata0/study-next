import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, inArray, isNotNull, isNull, lt, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const commentsRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const { id: userId } = ctx.user;

      const [deletedComment] = await db
        .delete(comments)
        .where(and(
          eq(comments.id, id),
          eq(comments.userId, userId),
        ))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return deletedComment;
    }),
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
            const { videoId, cursor, limit } = input;
            const [totalData, data] = await
                Promise.all([
                    db
                        .select({
                            count: count(),
                        })
                        .from(comments)
                        .where(and(
                            eq(comments.videoId, videoId),
                            // isNull(comments.parentId),
                        )),
                    db.select({
                        user: users,
                        ...getTableColumns(comments),
                    }).from(comments).where(and(eq(comments.videoId, videoId),
                        cursor ?
                            or(
                                lt(comments.updatedAt, cursor.updatedAt),
                                and(eq(comments.updatedAt, cursor.updatedAt),
                                    lt(comments.id, cursor.id))
                            ) : undefined
                    ))
                        .innerJoin(users, eq(comments.userId, users.id))
                        .orderBy(desc(comments.updatedAt))
                        .limit(limit + 1)
                ])

            const hasMore = data.length > limit;
            // Remove the last item if there is more data
            const items = hasMore ? data.slice(0, -1) : data;
            // Set the next cursor to the last item if there is more data
            const lastItem = items[items.length - 1];
            const nextCursor = hasMore
                ? {
                    id: lastItem.id,
                    updatedAt: lastItem.updatedAt,
                }
                : null;

            return {
                totalCount: totalData[0].count,
                items,
                nextCursor,
            };
        }),
});
