import webapp2
import urllib2


class MinuteCronPage(webapp2.RequestHandler):
    def get(self):
        request = urllib2.Request('https://us-central1-lighthouse-scanner.cloudfunctions.net/scanDomain', headers={"cronrequest": "true"})
        urllib2.urlopen(request).read()


app = webapp2.WSGIApplication([
    ('/minutes', MinuteCronPage),
    ], debug=True)
