import {Button} from "@/components/ButtonMain";

export default function Categories(){
    return (
        <div className=" w-full grid  sm:flex sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-5 bg-[#f3f3f3] border border-[#f3f3f3] rounded-xl p-3">
            <Button variant="secondary">
                Santé
            </Button>
            <Button variant="secondary">
                Ménage
            </Button>
            <Button variant="secondary">
                Alimentation
            </Button>
            <Button variant="secondary">
                Maison/terrain
            </Button>
            <Button variant="secondary">
                Hygiène
            </Button>
            <Button variant="secondary">
                Autres
            </Button>
        </div>
    );
}