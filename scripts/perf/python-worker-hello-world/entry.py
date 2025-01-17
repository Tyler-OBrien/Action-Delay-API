from js import Response

def on_fetch(request):
    return Response.new("Hello World!")