import Link from "next/link";


export default function RegisterPage() {
    return (
        <>
            <form  className="w-[466px] mt-12 mx-auto pt-7 pr-[33px] pb-[89px] pl-8 rounded-2xl shadow-[0_4px_6px_0_rgba(0,0,0,0.08)] bg-white" >
                <label htmlFor="l_CreateAccount" className="w-37 h-[29px] mr-[305px] mb-[26.5px] font-helvetica-neue text-2xl font-bold text-left text-[#0551ab] whitespace-nowrap" >Créer un compte</label>

                <label htmlFor="l_FirstName" className="w-37 h-[17px] flex font-montserrat text-sm font-bold text-left text-[#727272] ">Prénom</label>
                <input type="text" id="t_FirstName" name="t_FirstName" className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"/>

                <label htmlFor="l_LasteName" className="w-37 h-[17px] flex font-montserrat text-sm font-bold text-left text-[#727272] ">Nom</label>
                <input type="text" id="t_LastName" name="t_LastName" className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"/>

                <label htmlFor="l_UserName" className="w-37 h-[17px] flex font-montserrat text-sm font-bold text-left text-[#727272] whitespace-nowrap">Nom d'utilisateur (identifiant)</label>
                <input type="text" id="t_UserName" name="t_UserName" className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"/>

                <label htmlFor="l_PassWord" className="w-37 h-[17px] flex font-montserrat text-sm font-bold text-left text-[#727272] ">Mot de passe</label>
                <input type="password" id="t_PassWord" name="t_PassWord" className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"/>

                <label htmlFor="l_ConfirmPassWord" className="w-37 h-[17px] flex font-montserrat text-sm font-bold text-left text-[#727272] whitespace-nowrap">Confirmer le mot de passe</label>
                <input type="password" id="t_ConfirmPassWord" name="t_ConfirmPassWord" className="w-full h-10 rounded-lg border-2 border-[#dfdfdf] border-solid mb-4 mt-1 p-3 text-black"/>

                <input className="w-full rounded-full mb-4 mt-1 bg-[#0551ab] text-white py-4 font-bold hover:bg-[#f87c7c]" type="submit" value="S'inscrire"/><br/>

                <Link href="/login" className=" m-auto flex items-center space-x-2 font-montserrat text-base text-center text-[#20baa7] font-bold">J'ai déjà un compte</Link>

            </form>

        </>

    )
}