import { router } from "./_core/trpc";
import { authRouter } from "./routers/auth";
import { providersRouter } from "./routers/providers";
import { bookingRouter } from "./routers/booking";
import { reviewsRouter } from "./routers/reviews";
import { patientRouter } from "./routers/patient";
import { dealsRouter } from "./routers/deals";
import { notificationsRouter } from "./routers/notifications";
import { adminRouter } from "./routers/admin";
import { eventsRouter } from "./routers/events";

export const appRouter = router({
  auth: authRouter,
  providers: providersRouter,
  booking: bookingRouter,
  reviews: reviewsRouter,
  patient: patientRouter,
  deals: dealsRouter,
  notifications: notificationsRouter,
  admin: adminRouter,
  events: eventsRouter,
});

export type AppRouter = typeof appRouter;
