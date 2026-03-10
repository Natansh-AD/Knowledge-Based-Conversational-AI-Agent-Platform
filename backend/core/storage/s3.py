import boto3
from django.conf import settings
from botocore.exceptions import ClientError
import os

class S3Client:

    def __init__(self):
        self.bucket = settings.AWS_STORAGE_BUCKET_NAME
        self.client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY,
            aws_secret_access_key=settings.AWS_SECRET_KEY,
            region_name=settings.AWS_S3_REGION,
        )

    def upload_file(self, file_obj, key, content_type=None):
        extra_args = {}
        if content_type:
            extra_args["ContentType"] = content_type
        if extra_args:
            self.client.upload_fileobj(
                file_obj,
                self.bucket,
                key,
                ExtraArgs=extra_args
            )
        else :
            self.client.upload_fileobj(
                file_obj,
                self.bucket,
                key
            )

    def generate_upload_url(self, key, content_type=None):
        try:
            params = {
                "Bucket": self.bucket,
                "Key": key
            }
            if content_type:
                params["ContentType"] = content_type
            return self.client.generate_presigned_url(
                "put_object",
                Params=params,
                ExpiresIn=settings.S3_PRESIGNED_URL_EXPIRY
            )
        except ClientError as e:
            raise Exception(f"Could not generate upload URL due to error: {str(e)}")

    def download_file(self, key, filename):
        local_path = os.path.join(settings.MEDIA_PATH, filename)

        self.client.download_file(
            Bucket=self.bucket,
            Key=key,
            Filename=local_path
        )

        return local_path