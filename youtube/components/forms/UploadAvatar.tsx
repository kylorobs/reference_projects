import { Button, FileInput, Label } from 'flowbite-react';
import { SyntheticEvent } from 'react';

const UploadAvatar = ({ submit }: { submit: (e: SyntheticEvent) => void }) => {
    return (
        <form className="flex flex-col gap-4" onSubmit={submit}>
            <div id="fileUpload">
                <div className="mb-2 block">
                    <Label htmlFor="file" value="Upload file" />
                </div>
                <FileInput
                    id="file"
                    helperText="A profile picture is useful to confirm your are logged into your account"
                />
            </div>
            <Button type="submit">Submit</Button>
        </form>
    );
};

export default UploadAvatar;
