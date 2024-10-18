import { z } from 'zod';

export const messageRawSchema = z
  .object({
    type: z.literal('KEYSTROKE'),
    data: z.string(),
  })
  .or(
    z.object({
      type: z.literal('SCROLL'),
      data: z.number(),
    }),
  )
  .or(
    z.object({
      type: z.literal('MOUSE_MOVE'),
      data: z.object({
        x: z.number(),
        y: z.number(),
      }),
    }),
  );

export const messageSchema = z
  .object({
    id: z.string().optional(),
    type: z.literal('KEYSTROKE'),
    str: z.string().array(),
    action: z
      .object({
        actionData: z.string(),
        actionAt: z.date(),
      })
      .array(),
    // captureAt: z.date().or(z.string()),
  })
  .or(
    z.object({
      id: z.string().optional(),
      type: z.literal('SCROLL'),
      action: z
        .object({
          actionData: z.number(),
          actionAt: z.date(),
        })
        .array(),
      // captureAt: z.date().or(z.string()),
    }),
  )
  .or(
    z.object({
      id: z.string().optional(),
      type: z.literal('MOUSE_MOVE'),

      action: z
        .object({
          actionData: z.object({
            x: z.number(),
            y: z.number(),
          }),
          actionAt: z.date(),
        })
        .array(),
      // captureAt: z.date().or(z.string()),
    }),
  );

export type MessageRawType = z.infer<typeof messageRawSchema>;
export type MessageType = z.infer<typeof messageSchema>;
