import time
import logging

# Set up logger
logger = logging.getLogger("store.middleware")

class PerformanceLoggingMiddleware:
    """
    Logs request method, path, and response time.
    Only logs requests slower than threshold.
    Adds X-Response-Time header to all responses.
    """

    SLOW_REQUEST_THRESHOLD_MS = 100  # log only if slower than this

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()

        # Process request
        response = self.get_response(request)

        # Calculate duration in ms
        duration_ms = (time.time() - start_time) * 1000
        response["X-Response-Time"] = f"{duration_ms:.2f}ms"

        # Log slow requests only
        if duration_ms > self.SLOW_REQUEST_THRESHOLD_MS:
            logger.warning(
                f"Slow request: {request.method} {request.path} "
                f"took {duration_ms:.2f}ms"
            )
        else:
            # Optional: log all requests at info level
            logger.info(f"{request.method} {request.path} took {duration_ms:.2f}ms")

        return response
