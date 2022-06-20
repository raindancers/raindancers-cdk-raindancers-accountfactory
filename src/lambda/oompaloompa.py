import boto3
import uuid
from .oompaloompa import cfn_response_send

SUCCESS = 'SUCCESS'
FAILED = 'FAILED'

def on_event( event, context ):
	

	try:
		if event['RequestType'] == 'Create':
		
			sc = boto3.client('servicecatalog')

			account_factory_id = sc.search_products(
				Filters = {'FullTextSearch': ['AWS Control Tower Account Factory']}
			)['ProductViewSummaries'][0]['ProductId']

			provisioning_artefact_id = sc.describe_products(
				Id = account_factory_id
			)['ProvisioningArtifacts'][0]['Id']

			newAccountParameters = []
			for key,value in event['ResourceProperties']['NewAccountCfg'].items():
				newAccountParameters.append({'Key': key, 'Value': value})

			sc.provision_products(
				ProductId = account_factory_id,
				ProvisioningArtifactId = provisioning_artefact_id,
				ProvisionedProductName = '',
				ProvisioningParameters = newAccountParameters,
				ProvisionToken = str(uuid.uuid4())
			)
		
		elif event['RequestType'] == 'Update':
			cfn_response_send(event, context, FAILED, 
				responseData = {"Reason": "Account Resource is immutable"},
				physicalResourceId = event['PhysicalResourceId']
			)

		elif event['RequestType'] == 'Delete':
			cfn_response_send(event, context, SUCCESS, 
				responseData = {"Reason": "This is a lie. Delete is not yet implemented"},
				physicalResourceId = event['PhysicalResourceId']
			)

		else:
			cfn_response_send(event, context, FAILED, 
				responseData = {"Reason": "Invalid Method"},
				physicalResourceId = event['PhysicalResourceId']
			)

	except Exception as e:
		print('Error:', e)
		cfn_response_send(event, context, FAILED, 
			responseData = {
				"Reason": "Uncaught Error in Custom Resource Lambda.",
			},
			physicalResourceId = event['PhysicalResourceId']
		)
