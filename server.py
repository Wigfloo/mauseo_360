import http.server
import socketserver
PORT = 8080
class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
    print(f"===> SERVIDOR ANTI-CACHÉ INICIADO EN EL PUERTO {PORT} <===")
    httpd.serve_forever()