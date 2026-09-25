"""Local preview with clean routes and a real 404 response. Not a production server."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent / 'dist'
os.chdir(ROOT)
class Handler(SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        if code == 404:
            body=(ROOT/'404.html').read_bytes()
            self.send_response(404)
            self.send_header('Content-Type','text/html; charset=utf-8')
            self.send_header('Content-Length',str(len(body)))
            self.end_headers()
            if self.command != 'HEAD': self.wfile.write(body)
        else: super().send_error(code,message,explain)
print('Local preview: http://127.0.0.1:4173',flush=True)
ThreadingHTTPServer(('127.0.0.1',4173),Handler).serve_forever()
