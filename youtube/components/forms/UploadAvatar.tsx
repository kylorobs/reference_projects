import { Button, FileInput, Label } from 'flowbite-react';
import { SyntheticEvent } from 'react';

const UploadAvatar = ({
    submit,
    setFile,
    setFileUrl,
}: {
    submit: (e: SyntheticEvent) => void;
    setFile: (file: Blob | string) => void;
    setFileUrl: (str: string) => void;
}) => {
    return (
        <form className="flex flex-col gap-4" onSubmit={submit}>
            <div id="fileUpload">
                <div className="mb-2 block">
                    <Label htmlFor="file" value="Upload file" />
                </div>
                <FileInput
                    id="file"
                    onChange={(event) => {
                        if (event.target.files && event.target.files[0]) {
                            // if (event.target.files[0].size > 3072000) {
                            //     alert('Maximum size allowed is 3MB');
                            //     return false;
                            // }
                            setFile(event.target.files[0]);
                            setFileUrl(URL.createObjectURL(event.target.files[0]));
                        }
                    }}
                    helperText="A profile picture is useful to confirm your are logged into your account"
                />
            </div>
            <Button type="submit">Submit</Button>
        </form>
    );
};

export default UploadAvatar;
