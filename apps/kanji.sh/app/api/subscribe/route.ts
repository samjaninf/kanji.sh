import { NextRequest, NextResponse } from 'next/server';
import invariant from 'tiny-invariant';

interface Subscription {
    name: string;
    email: string;
}

export type ActionData = {
    status: 'success' | 'error';
    errors?: {
        name?: string;
        email?: string;
    };
    error?: string;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    const formData = await request.formData();
    const name = formData.get('name');
    invariant(typeof name === 'string', 'First Name must be a string');
    if (name.trim().length === 0) {
        return NextResponse.json<ActionData>(
            { status: 'error', errors: { name: 'Your name is necessary.' } },
            { status: 401 }
        );
    }

    const email = formData.get('email');
    invariant(typeof email === 'string', 'Email must be a string');
    if (!email || email.length === 0) {
        return NextResponse.json<ActionData>(
            { status: 'error', errors: { email: 'Email is necessary.' } },
            { status: 401 }
        );
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        return NextResponse.json<ActionData>(
            { status: 'error', errors: { email: 'Valid email, please.' } },
            { status: 401 }
        );
    }

    console.log('[Start] Function Subscribe');
    try {
        console.log('[Start] Read Request');
        console.log('[End] Read Request');
        await addContact({ name, email });
        return NextResponse.json<ActionData>({ status: 'success' }, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json<ActionData>(
            { status: 'error', error: JSON.stringify(error) },
            { status: 500 }
        );
    }
}

const addContact = async ({ name, email }: Subscription): Promise<void> => {
    const groupId = process.env.GROUP_ID as string;
    const apiToken = process.env.API_TOKEN as string;
    console.log('[Start] Add subscriber to group');

    /**
   * Adds delay for 5 seconds. Uncomment for testing.
   await new Promise(resolve => setTimeout(resolve, 5000));
   return;
   **/

    const response = await fetch(
        `https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`,
        {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-MailerLite-ApiKey': apiToken
            }),
            body: JSON.stringify({ name, email })
        }
    );
    if (response.status !== 200) {
        throw new Error(`Error adding subscriber to group: ${response.status}`);
    }
    console.log(
        '[End] API Call: API called successfully. Returned data: ' +
            JSON.stringify(response, null, 3)
    );
};