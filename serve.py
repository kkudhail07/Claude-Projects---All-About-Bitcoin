"""
Tiny static dev server with caching disabled, so the preview always
reflects the latest files (no more stale main.js / styles.css during edits).
Production hosts (Netlify, etc.) handle caching themselves — this is dev-only.
"""
import http.server
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    # Browsers abort connections constantly when caching is off; don't spew tracebacks.
    def handle_one_request(self):
        try:
            super().handle_one_request()
        except (ConnectionError, BrokenPipeError):
            self.close_connection = True

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionError, BrokenPipeError):
            pass

    def log_error(self, *args):
        pass

PORT = 8080
httpd = http.server.ThreadingHTTPServer(('', PORT), Handler)
httpd.daemon_threads = True
print('Serving all-about-bitcoin (no-cache) on http://localhost:%d' % PORT)
httpd.serve_forever()
