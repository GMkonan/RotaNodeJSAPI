import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars';
import fs from 'fs';


//criando uma interface para n passar o tipo objeto de forma direta
//como uma dica de boas praticas nas aulas de react
interface TemplateVariables {
    name: string;
    title: string;
    description: string;
    id: string;
    link: string;
}

class SendMailService {
    private client: Transporter
    constructor() {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                }
            })

            this.client = transporter;
        })
    }

    async execute(to: string, subject: string, variables: TemplateVariables, path: string) {
        const templateFileContent = fs.readFileSync(path).toString('utf-8')

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(variables);

        const message = await this.client.sendMail({
            to,
            subject,
            html: html,
            from: "NPS <noreplay@nps.com.br>"
        })

        console.log("Message sent: %s", message.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message))
    }
}

export default new SendMailService();