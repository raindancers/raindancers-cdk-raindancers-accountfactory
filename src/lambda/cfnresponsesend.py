import json
import urllib3
http = urllib3.PoolManager()

SUCCESS = "SUCCESS"
FAILED = "FAILED"

def local_response_send(event, context, responseStatus, responseData, physicalResourceId=None, noEcho=False):

	responseBody = {
			'Status': responseStatus,
			'Event': event,
			'Data': responseData
		}

	print (json.dumps(responseBody, indent=4, sort_keys= True))


def cfn_response_send(event, context, responseStatus, responseData, physicalResourceId=None, noEcho=False):

	if 'local' in event.keys():

		print(responseStatus, responseData)	

	else:	# being called as a lambda


		responseUrl = event['ResponseURL']

		print(responseUrl)

		responseBody = {
			'Status': responseStatus,
			'Reason': f'See the details in CloudWatch Log Stream: ' + context.log_stream_name,
			'PhysicalResourceId': physicalResourceId or context.log_stream_name,
			'StackId': event['StackId'],
			'RequestId': event['RequestId'],
			'LogicalResourceId': event['LogicalResourceId'],
			'NoEcho': noEcho,
			'Data': responseData
		}
		
		json_responseBody = json.dumps(responseBody)

		print("Response body:\n" + json_responseBody)

		headers = {
			'content-type' : '',
			'content-length' : str(len(json_responseBody))
		}

		try:
			
			response = http.request('PUT',responseUrl,body=json_responseBody.encode('utf-8'),headers=headers)
			print("Status code: " + response.reason)
		except Exception as e:
			print("send(..) failed executing requests.put(..): " + str(e))

