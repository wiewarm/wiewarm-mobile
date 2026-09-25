import z from "zod";

export const currentWeatherSchema = z.object({
  current: z.object({
    time: z.string(),
    temperature_2m: z.coerce.number(),
    is_day: z.coerce.number(),
    weather_code: z.coerce.number(),
  }),
});
